import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// 🔥 Inicializa o Firebase Admin (2ª geração / ESM)
initializeApp();

/**
 * 🔔 NOTIFICAÇÃO DE NOVO AGENDAMENTO
 */
export const notifyNewBooking = onDocumentCreated(
  "agendamentos/{docId}",
  async (event) => {
    console.log("🚨 Novo agendamento:", event.params.docId);

    const db = getFirestore();
    const messaging = getMessaging();

    const agendamento = event.data.data();

    // 📅 Data e hora do agendamento
    let dataFormatada = "data não informada";

    if (agendamento?.data && agendamento?.hora) {
      const dateTimeString = `${agendamento.data}T${agendamento.hora}:00`;
      const dateObj = new Date(dateTimeString);

      dataFormatada = dateObj.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    // 🔑 Busca TODOS os tokens dos barbeiros
    const tokensSnap = await db.collection("barbeirosTokens").get();
    const tokens = tokensSnap.docs
      .map(doc => doc.data().token)
      .filter(Boolean);

    if (tokens.length === 0) {
      console.log("⚠️ Nenhum token encontrado (novo agendamento)");
      return;
    }

    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "📅 Novo agendamento",
        body: `Agendado para ${dataFormatada}`
      }
    });

    console.log("✅ Notificação de novo agendamento enviada");
  }
);

/**
 * ❌ NOTIFICAÇÃO DE CANCELAMENTO
 */
export const notifyCancelledBooking = onDocumentUpdated(
  "agendamentos/{docId}",
  async (event) => {
    console.log("🚨 Atualização de agendamento:", event.params.docId);

    const before = event.data.before.data();
    const after = event.data.after.data();

    // 🔒 Só dispara se mudou para cancelado
    if (before?.status === "cancelled" || after?.status !== "cancelled") {
      return;
    }

    const db = getFirestore();
    const messaging = getMessaging();

    // 📅 Data e hora do agendamento cancelado
    let dataFormatada = "data não informada";

    if (after?.data && after?.hora) {
      const dateTimeString = `${after.data}T${after.hora}:00`;
      const dateObj = new Date(dateTimeString);

      dataFormatada = dateObj.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    // 🔑 Busca TODOS os tokens
    const tokensSnap = await db.collection("barbeirosTokens").get();
    const tokens = tokensSnap.docs
      .map(doc => doc.data().token)
      .filter(Boolean);

    if (tokens.length === 0) {
      console.log("⚠️ Nenhum token encontrado (cancelamento)");
      return;
    }

    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "❌ Agendamento cancelado",
        body: `Cancelado: ${dataFormatada}`
      }
    });

    console.log("❌ Notificação de cancelamento enviada");
  }
);
