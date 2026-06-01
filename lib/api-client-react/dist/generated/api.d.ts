import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { FacultyDashboardResponse, HealthStatus, HodDashboardResponse, ParentDashboardResponse, PrincipalDashboardResponse } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetParentDashboardUrl: () => string;
/**
 * Returns data for parent dashboard
 * @summary Parent Dashboard
 */
export declare const getParentDashboard: (options?: RequestInit) => Promise<ParentDashboardResponse>;
export declare const getGetParentDashboardQueryKey: () => readonly ["/api/parent/dashboard"];
export declare const getGetParentDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getParentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getParentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getParentDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetParentDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getParentDashboard>>>;
export type GetParentDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Parent Dashboard
 */
export declare function useGetParentDashboard<TData = Awaited<ReturnType<typeof getParentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getParentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetFacultyDashboardUrl: () => string;
/**
 * Returns data for faculty dashboard
 * @summary Faculty Dashboard
 */
export declare const getFacultyDashboard: (options?: RequestInit) => Promise<FacultyDashboardResponse>;
export declare const getGetFacultyDashboardQueryKey: () => readonly ["/api/faculty/dashboard"];
export declare const getGetFacultyDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getFacultyDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFacultyDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFacultyDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFacultyDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getFacultyDashboard>>>;
export type GetFacultyDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Faculty Dashboard
 */
export declare function useGetFacultyDashboard<TData = Awaited<ReturnType<typeof getFacultyDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFacultyDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetHodDashboardUrl: () => string;
/**
 * Returns data for HOD dashboard
 * @summary HOD Dashboard
 */
export declare const getHodDashboard: (options?: RequestInit) => Promise<HodDashboardResponse>;
export declare const getGetHodDashboardQueryKey: () => readonly ["/api/hod/dashboard"];
export declare const getGetHodDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getHodDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHodDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHodDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHodDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getHodDashboard>>>;
export type GetHodDashboardQueryError = ErrorType<unknown>;
/**
 * @summary HOD Dashboard
 */
export declare function useGetHodDashboard<TData = Awaited<ReturnType<typeof getHodDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHodDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPrincipalDashboardUrl: () => string;
/**
 * Returns data for principal dashboard
 * @summary Principal Dashboard
 */
export declare const getPrincipalDashboard: (options?: RequestInit) => Promise<PrincipalDashboardResponse>;
export declare const getGetPrincipalDashboardQueryKey: () => readonly ["/api/principal/dashboard"];
export declare const getGetPrincipalDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getPrincipalDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrincipalDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPrincipalDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPrincipalDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getPrincipalDashboard>>>;
export type GetPrincipalDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Principal Dashboard
 */
export declare function useGetPrincipalDashboard<TData = Awaited<ReturnType<typeof getPrincipalDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrincipalDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map