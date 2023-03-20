import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as request from 'supertest'
import { userSeeder } from 'test/seeders/user.seeder'
import { identityProviderStub } from 'test/stubs/identity-provider.stub'
import { prepareTestApp, TestAppDeps } from 'test/utils/prepare-test-app'
import { IdentityProvider } from './idp/idp'

describe('AuthController', () => {
  let deps: TestAppDeps

  beforeAll(async () => {
    deps = await prepareTestApp()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe('signInUser', () => {
    test('should reject when provide invalid body', async () => {
      const response = await request(deps.app.getHttpServer())
        .post('/auth/sign-in')
        .send({})

      console.log('response.body', response.body)

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.body.message.length).toBeGreaterThan(0)
    })

    test('should reject when provide a token that is not validated by idp', async () => {
      const response = await request(deps.app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          provider: 'GOOGLE',
          token: 'invalid-token',
        })

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      expect(response.body.code).toEqual('idp_auth_failed')
    })

    test('should create user with identity provider record when does not exist', async () => {
      jest
        .spyOn(IdentityProvider.prototype, 'auth')
        .mockResolvedValue(identityProviderStub() as any)

      const response = await request(deps.app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          provider: 'GOOGLE',
          token: 'invalid-token',
        })

      expect(response.statusCode).toEqual(HttpStatus.OK)

      expect(response.body).toMatchObject({
        userId: expect.any(Number),
      })

      const user = await deps.dbService.user.findFirst({
        include: {
          identityProviders: true,
        },
        where: {
          id: response.body.userId,
        },
      })

      console.log('user', user.identityProviders)

      expect(user).toMatchObject({
        id: response.body.userId,
        identityProviders: expect.arrayContaining([
          expect.objectContaining({
            provider: 'GOOGLE',
            providerId: identityProviderStub().data.idpID,
            userId: response.body.userId,
          }),
        ]),
      })

      expect(response.headers['set-cookie']).toHaveLength(1)
      const [cookie] = response.headers['set-cookie']

      expect(cookie.includes('review-c_session')).toBeTruthy()
    })
  })

  describe('me', () => {
    test('should reject when provide an invalid token', async () => {
      const response = await request(deps.app.getHttpServer()).get('/auth/me')

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      expect(response.body.code).toEqual('unauthorized')
    })

    test('should return user info when provide a valid token', async () => {
      const { user } = await userSeeder(deps.dbService)

      const token = deps.app.get<JwtService>(JwtService).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', [`review-c_session=${token}`])

      expect(response.statusCode).toEqual(HttpStatus.OK)

      expect(response.body.password).toBeFalsy()

      expect(response.body).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      })
    })
  })
})
