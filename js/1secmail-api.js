class OneSecMail 
{
    constructor()
    {
        this.base_url = 'https://www.1secmail.com/api/v1/'
    }

    async generate_emails(count=1)
    {
        let url = `${this.base_url}?action=genRandomMailbox&count=${count}`
        let emails = await fetch(url)
        return emails.json()
    }

    async check_inbox(mail_addr)
    {
        mail_addr = mail_addr.split('@')
        let mail_user = mail_addr[0]
        let mail_domain = mail_addr[1]
        let url = `${this.base_url}?action=getMessages&login=${mail_user}&domain=${mail_domain}`
        let mails = await fetch(url)
        return mails.json()
    }

    async read_email(mail_addr,msg_id)
    {
        mail_addr = mail_addr.split('@')
        let mail_user = mail_addr[0]
        let mail_domain = mail_addr[1]
        let url = `${this.base_url}?action=readMessage&login=${mail_user}&domain=${mail_domain}&id=${msg_id}`
		let mail_content = await fetch(url)
		return mail_content.json()
    }

}
