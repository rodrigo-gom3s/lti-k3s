# LTI-K3S

**⚠️ Warning:** This code is an academic project and is not intended for production use.


LTI-K3S is a web interface for managing and controlling a Kubernetes Cluster. It provides an intuitive UI to interact with namespaces, pods, deployments, and services, making Kubernetes cluster management easier and more accessible. 

**Note:** This frontend is designed to be used together with the [lti-k3s-python backend](https://github.com/iuricarras/lti-k3s-python) project.


## Features

- **Dashboard**: Overview of cluster resources and status.
- **Namespaces**: Create, list, and delete namespaces.
- **Pods**: Create, view, and delete pods with container configuration.
- **Deployments**: Manage deployments, including scaling and container setup.
- **Services**: View and manage Kubernetes services.
- **Authentication**: Secure access with authentication support.
- **Responsive UI**: Built with Vue 3, Tailwind CSS, and Vite for a modern, fast experience.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rodrigo-gom3s/lti-k3s
   cd lti-k3s
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technologies Used

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Pinia](https://pinia.vuejs.org/) (state management)
- [Vue Router](https://router.vuejs.org/)
- [Shadcn/vue](https://www.shadcn-vue.com/)
