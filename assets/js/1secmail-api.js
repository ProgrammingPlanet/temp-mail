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

    async check_inbox(mail_user, mail_domain)
    {
        let url = `${this.base_url}?action=getMessages&login=${mail_user}&domain=${mail_domain}`
        let mails = await fetch(url)
        return mails.json()
    }

    async read_email(mail_user, mail_domain, msg_id)
    {
        let url = `${this.base_url}?action=readMessage&login=${mail_user}&domain=${mail_domain}&id=${msg_id}`
		let mail_content = await fetch(url)
		return mail_content.json()
    }

}
