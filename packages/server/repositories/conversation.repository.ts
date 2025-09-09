const conversations = new Map<string, string>();

export const conversationRepository = {
   getLastConversationId(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastConversationId(conversationId: string, responseId: string) {
      return conversations.set(conversationId, responseId);
   },
};
