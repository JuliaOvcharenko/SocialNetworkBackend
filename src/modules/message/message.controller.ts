import { MessageService } from "./message.service";
import { MessageHttpControllerContract } from "./types/message.contracts";

export const MessageController: MessageHttpControllerContract = {
    fetchMessages: async (req, res) => {
        try {
            const chatId = Number(req.params.chatId);
            const messages = await MessageService.fetchMessages(chatId);
            res.status(200).json(messages);
        } catch {
            res.status(500).json("Internal Server Error");
        }
    },

    uploadImage: (req, res) => {
        const file = req.file;
        if (!file) {
            res.status(400).json("No file provided");
            return;
        }
        const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
        res.json({ url: `${baseUrl}/media/shakal/${file.filename}` });
    },
};
