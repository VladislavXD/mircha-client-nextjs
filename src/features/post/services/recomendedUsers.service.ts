import { api } from "@/src/api";

class RecomendedUsersService {
  public async getRecomendedUsers() {
    try {
      const response = await api.get("users/recomendatedUsers");

      return response;
    } catch (err) {
      throw err;
    }
  }
}

export const recomendedUsersService = new RecomendedUsersService();
