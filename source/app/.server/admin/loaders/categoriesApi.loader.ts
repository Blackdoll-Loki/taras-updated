import { json } from "@remix-run/node";
import { prisma } from "~/.server/shared/services/prisma.service"
import { categoryApiMapper } from "../mappers/categoryApi.mapper";


export async function categoriesApiLoader(){

  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null
    }
  });

  return json({categories: categories.map(categoryApiMapper)});
}
