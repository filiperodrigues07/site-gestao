import { hashPassword } from "@/lib/auth/password";

const plain = process.argv[2];

if (!plain) {
  console.error("Uso: npm run hash-password -- \"sua-senha-aqui\"");
  process.exit(1);
}

console.log(hashPassword(plain));
