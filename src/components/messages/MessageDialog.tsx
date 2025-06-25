
import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Message, User } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  receiverUser: User & { id: string };
  children: React.ReactNode;
}

export function MessageDialog({ receiverUser, children }: MessageDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && user) {
      // Set up real-time listener for messages
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        } as Message & { id: string }));

        // Filter messages between these two users specifically
        const filteredMessages = messagesList.filter(msg => 
          (msg.senderId === user.id && msg.receiverId === receiverUser.id) ||
          (msg.senderId === receiverUser.id && msg.receiverId === user.id)
        );

        setMessages(filteredMessages);

        // Mark received messages as read
        const unreadMessages = filteredMessages.filter(msg => 
          msg.receiverId === user.id && !msg.read
        );

        unreadMessages.forEach(async (msg) => {
          await updateDoc(doc(db, 'messages', msg.id), { read: true });
        });
      });

      return () => unsubscribe();
    }
  }, [open, user, receiverUser.id]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setLoading(true);
    try {
      const messageData = {
        senderId: user.id,
        receiverId: receiverUser.id,
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false,
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${receiverUser.displayName}.`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message {receiverUser.displayName}
          </DialogTitle>
          <DialogDescription>
            Send a message to {receiverUser.displayName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <ScrollArea className="h-64 w-full border rounded p-4">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
