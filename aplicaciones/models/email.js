function Email (from, to, subject, date, flag, uid, mensaje){
        this.from = from
        this.to = to
        this.subject = subject
        this.date = date
        this.mensaje = mensaje
}

module.exports = {
    Email: Email
}