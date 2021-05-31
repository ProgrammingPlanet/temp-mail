let app = Vue.createApp({

    data(){
        return {

            api: undefined,

            mail_addr: undefined,

            mail_domain: '1secmail.com',

            available_domains: new Set(),

            inbox: [

            ],

            viewEmail: {
                id: undefined
            },

            emailsCache: [

            ]
        }
    },

    methods: {
        generateEmails(count)
        {
            this.api.generate_emails(count).then(m => {
                if(m.length === 0)
                {
                    return notyf.error('unable to generate email, try again or refresh the page.')
                }
                m.forEach((v, i) => {
                    this.available_domains.add(v.split('@')[1])
                })
                this.mail_addr = m[0].split('@')[0]
                this.inbox = this.emailsCache = []
                this.viewEmail = {id: undefined}
            })
            .catch(e => {notyf.error(e.message)})
        },
        fetchInbox()
        {
            this.api.check_inbox(this.mail_addr, this.mail_domain).then(mails => {
                mails.sort((a, b) => a.date.localeCompare(b.date)); //sort by date
                this.inbox = mails
            })
            .catch(e => {notyf.error(e.message)})
        },
        ToggleMailView(id)
        {
            console.log(id)
            if(id === this.viewEmail.id)
            {
                this.viewEmail = {id: undefined}
            }
            else{
                let tragetMail = this.emailsCache.filter((mail) => {return mail.id === id})
                if(tragetMail.length !== 0)
                {
                    this.viewEmail = tragetMail[0]
                }
                else{
                    this.api.read_email(this.mail_addr,this.mail_domain,id).then(msg => {
                        this.emailsCache.push(msg)
                        this.viewEmail = msg
                    })
                    .catch(e => {notyf.error(e.message)})
                }
            }
        },
        randomMailAddr()
        {
            this.mail_addr = Math.random().toString(36).slice(2)
        },
        CopyToClipBoard()
        {
          navigator.clipboard.writeText(this.mail_addr+'@'+this.mail_domain).then(() => {
            notyf.success('copied to clipboard')
          }, () => {
            notyf.error('error in copying to clipboard')
          })
        },
        UpgradeToSecure()
        {
            if(!window.isSecureContext)
            {
              window.location.href = 'https://' + location.host + location.pathname
            }
        }
    },
    created(){
        this.UpgradeToSecure()
        this.api = new OneSecMail()
        this.generateEmails(100)
        setInterval(this.fetchInbox, 5000)
    }
})

app.mount('#app')


var notyf = new Notyf()

var x = null