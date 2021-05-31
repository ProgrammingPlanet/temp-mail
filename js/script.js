let app = Vue.createApp({

    data(){
        return {

            api: undefined,

            addr: '....',

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
        generateEmail()
        {
            this.api.generate_emails().then(m => {
                if(m.length === 0)
                {
                    return notyf.error('unable to generate email, try again or refresh the page.')
                }
                this.addr = m[0]
                this.inbox = []
                this.viewEmail = {id: undefined}
                this.emailsCache = []
            })
            .catch(e => {notyf.error(e.message)})
        },
        fetchInbox()
        {
            if(this.addr.indexOf('@') !== -1)
            {
                this.api.check_inbox(this.addr).then(mails => {
                    mails.sort((a, b) => a.date.localeCompare(b.date)); //sort by date
                    this.inbox = mails
                })
                .catch(e => {notyf.error(e.message)})
            }
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
                    this.api.read_email(this.addr, id).then(msg => {
                        this.emailsCache.push(msg)
                        this.viewEmail = msg
                    })
                    .catch(e => {notyf.error(e.message)})
                }
            }
        },
        CopyToClipBoard()
        {
          navigator.clipboard.writeText(this.addr).then(() => {
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
        this.generateEmail()
        setInterval(this.fetchInbox, 5000)
    }
})

app.mount('#app')


var notyf = new Notyf()

var x = null