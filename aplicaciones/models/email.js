function Email (from, to, subject, date, uid, mensaje){
        this.from = from
        this.to = to
        this.subject = subject
        this.date = date
        this.uid = uid
        this.mensaje = mensaje
}

module.exports = {
    Email: Email
}