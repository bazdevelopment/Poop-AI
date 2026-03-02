import storage from '@react-native-firebase/storage';
import axios from 'axios';
import { firebaseCloudFunctionsInstance } from 'firebase/config';
import Env from '../../../env';

export async function fetchConversation({
  conversationId,
}: {
  conversationId: string;
}) {
  try {
    const { data } = await firebaseCloudFunctionsInstance.httpsCallable(
      'getConversation',
    )({ conversationId });
    return data.conversation;
  } catch (error) {
    throw error;
  }
}

export async function getAllUserConversations({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}) {
  try {
    const { data } = await firebaseCloudFunctionsInstance.httpsCallable(
      'getAllUserConversations',
    )({ userId, limit });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function sendConversationMessage({
  userMessage,
  conversationId,
  conversationMode,
  userId,
  language,
}: {
  userMessage: string;
  conversationId: string;
  conversationMode: string;
  userId: string;
  language: string;
}) {
  try {
    const response = await axios.post(
      Env.EXPO_PUBLIC_CONTINUE_CONVERSATION_ENDPOINT as string,
      {
        userId,
        conversationId,
        userMessage,
        conversationMode,
      },
      {
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'multipart/form-data',
          'Accept-Language': language,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
}

/**
 * Legacy function to match your existing API
 * Analyzes multiple images/videos/PDFs using AI
 */

type MediaFile = {
  fileUri: string;
  id: string;
  url?: string; // If already uploaded
  type: 'image' | 'video' | 'pdf';
  mimeType?: string;
};
export async function analyzeMultipleFilesUsingAI(payload: {
  mediaFiles: MediaFile[];
  language: string;
  userMessage: string;
  userId: string;
  conversationId?: string;
}) {
  try {
    // Upload all files and get URLs
    const fileUrls = await uploadAllFiles(payload.mediaFiles, payload.userId);
    // Call cloud function
    const sendChatMessageFn =
      firebaseCloudFunctionsInstance.httpsCallable('sendChatMessage');
    const { data } = await sendChatMessageFn({
      userId: payload.userId,
      conversationId: payload.conversationId,
      userMessage: payload.userMessage,
      language: payload.language,
      fileUrls,
      history: [],
      includePreviousHistory: true,
    });
    return data;
  } catch (error) {
    console.error('Error analyzing files:', error);
    throw error;
  }
}

async function uploadToFirebaseStorage(
  localPath: string,
  conversationId: string,
): Promise<string> {
  const fileName = localPath?.split('/').pop()!;
  const ref = storage().ref(`interpretations/${conversationId}/${fileName}`);
  await ref.putFile(localPath);
  return await ref.getDownloadURL();
}

async function uploadAllFiles(files: MediaFile[], conversationId: string) {
  return Promise.all(
    files.map((f) => uploadToFirebaseStorage(f.uri, conversationId)),
  );
}

export async function fetchAllUserConversations({ limit }: { limit: number }) {
  try {
    const { data } = await firebaseCloudFunctionsInstance.httpsCallable(
      'getAllConversations',
    )({ limit });

    return data;
  } catch (error) {
    throw error;
  }
}
