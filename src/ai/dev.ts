
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ui-code.ts';
import '@/ai/flows/validate-credential-flow.ts';
import '@/ai/flows/process-chat-message-flow.ts';
import '@/ai/flows/general-assistant-flow.ts';
