import prisma from "@repo/db/dbClient";

// announce winner for the match
export const logWinnerDB = async (matchId: String, userId: String) => {
  try {
    const result = await prisma.match.update({
      data: {
        winnerId: userId as string,
        status: "Completed",
      },
      where: {
        id: matchId as string,
      },
    });

    if (result == null) {
      return {
        success: false,
        message: "no match found!",
      };
    }

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "error while updating the db",
    };
  }
};
