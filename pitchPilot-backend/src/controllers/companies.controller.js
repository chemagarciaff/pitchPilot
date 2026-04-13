import prisma from "../db.js";

// GET /api/company
export async function getMyCompany(req, res) {
  try {
    // 1. Obtener el usuario autenticado
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { companyId: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 2. Obtener la empresa
    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // 3. Devolverla
    return res.json(company);
  } catch (error) {
    console.error("Error al obtener la empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}