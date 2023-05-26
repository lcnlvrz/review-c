import { withAuth } from './withAuth'
import type { withCurrentWorkspace } from './withCurrentWorkspace'
import get from 'lodash.get'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

export interface PagePropsMergedMap {
  currentWorkspace: Awaited<
    ReturnTypeSSFunction<typeof withCurrentWorkspace>['props']
  >['currentWorkspace']
  auth: Awaited<
    ReturnTypeSSFunction<ReturnType<typeof withAuth>>['props']
  >['auth']
}

export const getPagePropsTypeSafety = <
  T extends keyof PagePropsMergedMap = keyof PagePropsMergedMap
>(
  pageProps: unknown,
  path: T
): PagePropsMergedMap[T] => {
  return get(pageProps, `props.${path}`) as any as PagePropsMergedMap[T]
}

export type SSFunction<O extends Record<string, any> = Record<string, any>> = (
  ctx: GetServerSidePropsContext,
  cookie?: string,
  pageProps?: unknown
) => Promise<GetServerSidePropsResult<O>>

export type ReturnTypeSSFunction<T extends SSFunction> = Awaited<
  UnionToIntersection<Awaited<ReturnType<T>>>
>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type InferCompose<T extends (args: any) => any> = UnionToIntersection<
  Awaited<Extract<Awaited<ReturnType<T>>, { props: any }>['props']>
>

type ComposeMode = 'parallel' | 'sequential'

export const COMPOSE_DEFAULT_MODE: ComposeMode = 'parallel'

export function compose<R extends SSFunction, U extends ReadonlyArray<R>>(
  mode: ComposeMode,
  ...callbacks: U
): (
  ctx: GetServerSidePropsContext
) => Promise<UnionToIntersection<Awaited<ReturnType<U[number]>>>>

export function compose(
  mode: ComposeMode = COMPOSE_DEFAULT_MODE,
  ...ssf: SSFunction[]
) {
  return async (ctx: GetServerSidePropsContext) => {
    const parallel = async () => {
      const result = await Promise.all(
        ssf.map((fn) => fn(ctx, ctx.req.headers.cookie || ''))
      )

      const props = result.map((r) => {
        if ('props' in r) {
          return r.props
        }

        return {}
      })

      return {
        ...result.reduce((prev, curr) => ({ ...prev, ...curr })),
        props: props.reduce((prev, curr) => ({ ...prev, ...curr })),
      }
    }

    const sequential = async () => {
      const results: GetServerSidePropsResult<Record<string, unknown>>[] = []

      for (const fn of ssf) {
        const intermediateResult = await fn(
          ctx,
          ctx.req.headers.cookie || '',
          reducePageProps(results)
        )

        if ('redirect' in intermediateResult) {
          return intermediateResult
        }

        if ('notFound' in intermediateResult) {
          return intermediateResult
        }

        results.push(intermediateResult)
      }

      const props = results.map((r) => {
        if ('props' in r) {
          return r.props
        }

        return {}
      })

      return {
        props: props.reduce((prev, curr) => ({ ...prev, ...curr })),
      }
    }

    switch (mode) {
      case 'parallel':
        return await parallel()

      default:
        return await sequential()
    }
  }
}

function reducePageProps(
  results: GetServerSidePropsResult<Record<string, unknown>>[]
) {
  const props = results.map((r) => {
    if ('props' in r) {
      return r.props
    }

    return {}
  })

  return {
    props: props.reduce((prev, curr) => ({ ...prev, ...curr }), {}),
  }
}
