export function simpleAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer demo-token-")) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const userId = Number(auth.replace("Bearer demo-token-", ""));

  if (!userId) {
    return res.status(401).json({ message: "Token inválido" });
  }

  req.user = { id: userId };
  next();
}