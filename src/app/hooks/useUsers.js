import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "@app/apis/userApi"; // You'll need to create this
import { Toast } from "@app/components/Notification/Notification";

const useFetchAllUsers = (searchName, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["users", searchName, page, pageSize],
    queryFn: async () => {
      const { data } = await UserApi.getAllUsers({
        searchName,
        page,
        limit: pageSize,
      });

      return data.users;
    },
  });
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await UserApi.deleteUser(userId);
      return data;
    },
    onSuccess: () => {
      Toast("success", "User deleted successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      Toast("error", error.response?.data?.message || "Failed to delete user");
    },
  });
};

const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isActive }) => {
      const { data } = await UserApi.updateUserStatus(userId, isActive);
      return data;
    },
    onSuccess: () => {
      Toast("success", "User status updated successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      Toast(
        "error",
        error.response?.data?.message || "Failed to update user status"
      );
    },
  });
};

const useGetUserDetail = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data } = await UserApi.getUserDetail(userId);
      return data.data;
    },
  });
};

const useSendPromotions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await UserApi.sendPromotions(userId);
      return data;
    },
    onSuccess: (data) => {
      Toast(
        "success",
        `Promotions sent successfully! ${data.promotionsCount} active promotions sent.`
      );
      queryClient.invalidateQueries(["userProfile"]);
    },
    onError: (error) => {
      Toast(
        "error",
        error.response?.data?.message || "Failed to send promotions"
      );
    },
  });
};

export {
  useFetchAllUsers,
  useDeleteUser,
  useUpdateUserStatus,
  useGetUserDetail,
  useSendPromotions,
};
