
# NativeUI Builder

**Visually compose, preview, and manage AI-driven workflows and interfaces for Next.js applications.**

**Repository:** [https://github.com/NativeUI-Cloud/interface-build](https://github.com/NativeUI-Cloud/interface-build)

## Vision

NativeUI Builder aims to empower developers and designers to rapidly create sophisticated AI-powered user experiences. By providing an intuitive visual interface for building complex AI agent workflows, connecting various triggers (like chat or Telegram), and configuring diverse language models, NativeUI Builder streamlines the development process. Our goal is to bridge the gap between powerful AI capabilities and user-friendly application design, enabling the creation of dynamic, intelligent, and responsive Next.js applications with ease.

## Key Features

*   **Visual Workflow Canvas:** Drag-and-drop interface to build and connect different nodes (AI Agents, Triggers, Models).
*   **AI Agent Configuration:** Detailed modals for configuring AI Agent parameters, including system prompts, model selection, and memory options.
*   **Chat Model Integration:**
    *   Support for popular LLM providers (OpenAI, Google AI, Anthropic, etc.).
    *   Secure credential management with local storage and API key validation.
    *   Visual linking of chat models to AI Agents.
*   **Trigger Nodes:** Initiate workflows from various sources like direct chat input or Telegram messages.
*   **Real-time Workflow Testing:** Integrated chat panel to test your AI agent workflows live.
*   **AI Assistant:** Built-in AI helper to answer questions about using NativeUI Builder and its features.
*   **Workflow Management:**
    *   Name, save, and automatically persist workflows.
    *   Open and manage existing workflows through a dedicated modal.
*   **Resizable Layout:** Flexible interface with resizable panels for components, canvas, and AI assistant.
*   **Expanded Component Library:** Includes additional ShadCN UI elements like AspectRatio, Collapsible, Command menu, HoverCard, and Carousel to build richer layouts.
*   **Modern Tech Stack:** Built with Next.js (App Router), React, ShadCN UI, Tailwind CSS, and Genkit for AI functionalities.

## Tech Stack

*   **Framework:** Next.js 15+ (App Router)
*   **UI Library:** React 18+
*   **Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for Google AI, and structured to allow other provider integrations)
*   **Language:** TypeScript

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or newer recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NativeUI-Cloud/interface-build.git
    cd interface-build
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project by copying the `.env.example` file (if one exists) or by creating a new one.
    You'll need to add your API keys for the AI models you intend to use. For example:
    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    # Add other API keys as needed, e.g., for Google AI (though Genkit often uses Application Default Credentials for Google Cloud)
    ```
    *Note: For Google AI models via Genkit, ensure you have authenticated via the Google Cloud CLI (`gcloud auth application-default login`) if you're not using an explicit API key.*

### Running the Application

1.  **Run the Next.js development server:**
    This server handles the UI and frontend application.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

2.  **Run the Genkit development server (in a separate terminal):**
    This server handles the AI flows defined with Genkit.
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes
    # npm run genkit:watch
    ```
    The Genkit development UI (Flows Explorer) will typically be available at `http://localhost:4000`.

## How to Use NativeUI Builder

1.  **Launch the Application:** After starting both development servers, open your browser to `http://localhost:9002`.
2.  **Create/Open a Workflow:**
    *   On first launch (or if no active workflow is found), you'll be prompted to name your new workflow.
    *   Use the "Open Workflows" button (folder icon) in the canvas header to open existing workflows or create a new one using the "+" button.
3.  **Add Nodes:**
    *   **Triggers:** Click the "Add a trigger" button at the bottom of the left-hand Components Palette. Select a trigger like "Chat Trigger" or "Telegram Trigger". This node will appear on the canvas. Only one of each trigger type is typically used per workflow.
    *   **AI Nodes:** Click "AI" in the Components Palette, then select a node like "AI Agent". This will open a configuration modal. Closing this modal (even without full configuration) will place the AI Agent node on the canvas.
4.  **Configure Nodes:**
    *   **Double-click** any node on the canvas to open its configuration modal.
    *   For an **AI Agent**:
        *   **Parameters Tab:** Define the prompt source (e.g., from a connected Chat Trigger or a custom input) and the system prompt.
        *   **Chat Model Footer Button:** Click this to open the "Chat Model Selection Modal".
            *   Select a provider (e.g., OpenAI, Google AI).
            *   Select a specific model.
            *   Add or select existing credentials. When adding new credentials, provide an API key and endpoint (if required). The system will attempt to validate the credentials.
            *   Once a valid model and credential are set, a "Connected Chat Model" node will visually link to your AI Agent on the canvas.
        *   **Memory Tab:** Select and configure memory options for the agent (currently logs selection to console).
5.  **Connect Nodes:**
    *   Nodes have input (left/top) and output (right/bottom) connectors.
    *   Click and drag from an output connector of one node to an input connector of another node to create a connection line.
    *   For example, connect the output of a "Chat Trigger" to the input of an "AI Agent".
6.  **Test Your Workflow:**
    *   Click the "Test workflow" button in the canvas header. This will ensure the "Workflow Chat" panel is open (usually at the bottom of the canvas area).
    *   Type messages into the Workflow Chat panel. If a Chat Trigger is connected to a configured AI Agent, your input will be processed by the agent, and its response will appear in the chat.
    *   The AI Agent node will highlight (pulsing yellow border) while it's processing.
7.  **Use the AI Assistant:**
    *   Click the "Sparkles" icon button (usually on the right or bottom-right of the canvas area) to toggle the AI Assistant panel.
    *   Ask the AI Assistant questions about how to use NativeUI Builder, its features, or general concepts.
8.  **Save and Manage:**
*   Workflows are auto-saved as you make changes.
*   You can explicitly save using the "Save" button in the canvas header.
*   Use the "Share" button to (simulate) sharing your workflow.

## Landing Page Creator

Select **Landing Page Creator** on the startup modal to experiment with a simple web page builder. Drag and drop headings, text blocks, images and other elements onto the canvas. The **Globe** icon lets you open a live preview in a new tab. Use **Publish** to save the page in localStorage and copy a shareable link.

## Future Enhancements

*   Full implementation of all node types from the palette.
*   Detailed configuration options for each memory type.
*   Tool integration for AI Agents.
*   Real-time collaboration features.
*   Deployment options for created workflows.
*   More sophisticated visual feedback for workflow execution, including connection line highlighting.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and that all tests pass.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
