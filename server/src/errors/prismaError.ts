import { Prisma } from "@prisma/client";

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case "P2002": {
      const fields = error.meta?.target as string[] | undefined;

      return {
        statusCode: 409,
        message: `${fields?.join(", ") ?? "Field"} already exists`,
      };
    }

    default:
      return null;
  }
}

export default handlePrismaError;
