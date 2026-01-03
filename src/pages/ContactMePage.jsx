import { useState } from "react";
import styles from "./ContactMePage.module.css"
import { FaDiscord, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa"
import { emailService } from "../services/emailService";

const socialNetworks = [
    {
        name: "Telegram",
        icon: <FaTelegramPlane/>,
        link: "https://t.me/danilka2315"
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedinIn/>,
        link: "https://www.linkedin.com/in/danil-prokhorenko-08767b231/"
    },
    {
        name: "Discord",
        icon: <FaDiscord/>,
        link: "https://discord.com/users/295212761292472320"
    }
];

function ContactMePage() {
    const [emailForm, setEmailForm] = useState({
        to: "danilka2315.g@gmail.com",
        from: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        emailService.sendEmail(emailForm);
    };

   return (
    <div className={styles.container}>
        <div className={styles.yetAnotherContainer}>
            <h3>You can reach me on:</h3>
            {socialNetworks.map(s => {
                return <div className={styles.snButton} onClick={() => window.open(s.link, "_blank", "noopener,noreferrer")}>
                        {s.name} {s.icon}
                    </div>
            })}
            <h3>Or send me a message:</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formElement}>
                    <label className={styles.label} htmlFor="to">To:</label>
                    <input
                        className={styles.input}
                        id="to"
                        name="to"
                        type="email"
                        disabled
                        value={emailForm.to}
                    />
                </div>

                <div className={styles.formElement}>
                    <label className={styles.label} htmlFor="from">From:</label>
                    <input
                        className={styles.input}
                        id="from"
                        name="from"
                        type="email"
                        required
                        value={emailForm.from}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formElement}>
                    <label className={styles.label} htmlFor="subject">Subject:</label>
                    <input
                        className={styles.input}
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={emailForm.subject}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formElement}>
                    <label className={styles.label} htmlFor="message">Message:</label>
                    <textarea
                        className={styles.input}
                        style={{ height: "180px" }}
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={emailForm.message}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    <h2>Send</h2>
                </button>
            </form>
        </div>
    </div>
   )

}

export default ContactMePage;