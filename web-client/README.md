## Getting Started

First, install any dependencies:

```bash
cd web-client
npm i
```

Firebase encryption is handled via the `bcrypt` Typescript library. To run the frontend and access our firebase, please reach out to developer [**Drew Hall**](mailto:at.hall2026@gmail.com) to receive the salt required for our password hashing. When you receive the salt, include a file at the path src/app/pages/auth/secret_salt.ts and input the following code:

```
export const secret = "YOUR_SALT_HERE";
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.