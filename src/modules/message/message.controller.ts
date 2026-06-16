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
        res.json({ url: file.filename });
    },
};
