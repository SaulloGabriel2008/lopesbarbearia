const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyNewBooking = onDocumentCreated(
  "agendamentos/{id}",
  async (event) => {
    const data = event.data.data();

    const tokensSnap = await admin
      .firestore()
      .collection("barbeirosTokens")
      .get();

    const tokens = tokensSnap.docs.map(doc => doc.data().token);

    if (!tokens.length) return;

    const payload = {
      notification: {
        title: "✂️ Novo agendamento",
        body: `${data.cliente || "Cliente"} – ${data.servico || "Serviço"} às ${data.horario || ""}`
      }
    };

    await admin.messaging().sendToDevice(tokens, payload);
  }
);
