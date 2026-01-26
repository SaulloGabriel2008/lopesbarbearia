const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

setGlobalOptions({ region: "southamerica-east1" });

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

    await admin.messaging().sendToDevice(tokens, {
      notification: {
        title: "✂️ Novo agendamento",
        body: `${data.nome} – ${data.servico} às ${data.hora}`
      }
    });
  }
);
