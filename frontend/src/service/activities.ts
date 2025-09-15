import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../config";
import type { Activity } from "../types/activity";

export const useActivities = (): UseQueryResult<Activity[], Error> => {
    return useQuery<Activity[], Error>({
        queryKey: ['activities'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/activities`);
            return data;
        },
    });
};

export const useActivityAdjecency = (): UseQueryResult<string[], Error> => {
    return useQuery<string[]>({
        queryKey: ['adjecency'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/adjacency`);
            return data;
        },
    });
};
