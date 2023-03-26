import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

export type SSFunction<O extends object = object> = (
  ctx: GetServerSidePropsContext,
  cookie?: string
) => Promise<GetServerSidePropsResult<O>>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type InferCompose<T extends (args: any) => any> = UnionToIntersection<
  Awaited<Extract<Awaited<ReturnType<T>>, { props: any }>['props']>
>

export function compose<R extends SSFunction, U extends ReadonlyArray<R>>(
  ...callbacks: U
): (
  ctx: GetServerSidePropsContext
) => Promise<UnionToIntersection<Awaited<ReturnType<U[number]>>>>

export function compose(...ssf: SSFunction[]) {
  return async (ctx: GetServerSidePropsContext) => {
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
}
