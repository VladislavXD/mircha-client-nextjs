import { useQuery } from "@tanstack/react-query";

import { recomendedUsersService } from "../services/recomendedUsers.service";

export function useRecomededUsers() {
  return useQuery({
    queryKey: ["recomedatedUsers"],
    queryFn: async () => {
      return await recomendedUsersService.getRecomendedUsers();
    },
  });
}
