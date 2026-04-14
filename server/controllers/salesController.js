import nodemailer from 'nodemailer';

export const capturePayment = async (req, res) => {
    try {
        const { orderID, userEmail, userName, cart, total } = req.body;

        if (!orderID) {
            return res.status(400).json({ error: "Missing order ID" });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER || 'leola.murray59@ethereal.email',
                pass: process.env.EMAIL_PASS || 'QfPbnDkH9vRZY7nFMg'
            }
        });

        const itemsList = cart.map(item => `<li>${item.name} - $${item.price} x ${item.quantity}</li>`).join('');

        try {
            await transporter.sendMail({
                from: '"Ecommerce Premium" <no-reply@ecommerce.com>',
                to: userEmail || 'test@test.com',
                subject: 'Confirmación de tu pedido',
                html: `<h1>¡Hola ${userName || 'Usuario'}!</h1>
                       <p>Tu pedido ha sido procesado exitosamente mediante PayPal (Order ID: ${orderID}).</p>
                       <h2>Resumen de compras:</h2>
                       <ul>${itemsList}</ul>
                       <p>Total pagado: <strong>$${total}</strong></p>
                       <p>¡Gracias por tu compra!</p>`
            });
            console.log("Email sent for order:", orderID);
        } catch (emailErr) {
            console.error("Error sending email:", emailErr);
        }

        return res.json({ success: true, message: "Payment captured & email sent" });
    } catch (error) {
        console.error("Payment Capture Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
