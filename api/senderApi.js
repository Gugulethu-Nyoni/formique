import { Resend } from 'resend';

const resend = new Resend('re_8AFucjci_GEDk1y2txzGWkkFXhAcQXKYw');

(async function() {
  const { data, error } = await resend.emails.send({
    from: 'info@sender.formiquejs.com',
    to: 'gugunnn@gmail.com',
    subject: 'Hello World',
    html: '<strong>it works!</strong>'
  });

  if (error) {
    return console.log(error);
  }

  console.log(data);
})();