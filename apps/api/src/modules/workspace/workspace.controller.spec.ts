import { HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as request from 'supertest'
import { userSeeder } from 'test/seeders/user.seeder'
import { workspaceSeeder } from 'test/seeders/workspace.seeder'
import { prepareTestApp, TestAppDeps } from 'test/utils/prepare-test-app'
import { USER_JWT_SERVICE } from '../auth/user-jwt.module'
import { Emailer } from '../notification/emailer'

describe('WorkspaceController', () => {
  let deps: TestAppDeps

  beforeAll(async () => {
    deps = await prepareTestApp()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe('createWorkspace', () => {
    test('should reject when provide invalid token', async () => {
      const response = await request(deps.app.getHttpServer())
        .post('/workspace')
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
    })

    test('should reject when provide invalid body', async () => {
      const { user } = await userSeeder(deps.dbService)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post('/workspace')
        .set('Cookie', [`review-c_session=${token}`])
        .send({
          name: 'string',
          description: true,
        })

      console.log('response.body', response.body)

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.body.message.length).toBeGreaterThan(0)
    })

    test('should create a workspace when everything is OK', async () => {
      const body = {
        name: 'Luciano',
        description: 'A workspace for made reviews',
      }

      const { user } = await userSeeder(deps.dbService)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post('/workspace')
        .set('Cookie', [`review-c_session=${token}`])
        .send(body)

      expect(response.statusCode).toEqual(HttpStatus.CREATED)
      expect(response.body).toMatchObject({
        workspaceId: expect.any(String),
      })

      const workspace = await deps.dbService.workspace.findFirst({
        where: {
          id: response.body.workspaceId,
        },
        include: {
          members: true,
        },
      })

      expect(workspace).toMatchObject({
        ...body,
        members: expect.arrayContaining([
          expect.objectContaining({
            userId: user.id,
            role: 'OWNER',
          }),
        ]),
      })
    })
  })

  describe('updateWorkspace', () => {
    test('should reject when provide invalid token', async () => {
      const response = await request(deps.app.getHttpServer())
        .put('/workspace/fake')
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
    })

    test('should reject when workspace does not belong to request user', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { user: extUser } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, extUser)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .put(`/workspace/${workspace.id}`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      expect(response.body.code).toEqual('not_found_workspace')
    })

    test('should reject when request user is not workspace owner', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user, {
        role: 'MEMBER',
      })

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .put(`/workspace/${workspace.id}`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.FORBIDDEN)
      expect(response.body.code).toEqual('invalid_member_role')
    })

    test('should update when everything is OK', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const fieldsUpdated = {
        name: 'Luciano Workspace updated',
      }

      const response = await request(deps.app.getHttpServer())
        .put(`/workspace/${workspace.id}`)
        .set('Cookie', [`review-c_session=${token}`])
        .send(fieldsUpdated)

      expect(response.statusCode).toEqual(HttpStatus.OK)

      const workspaceUpdated = await deps.dbService.workspace.findFirst({
        where: {
          id: workspace.id,
        },
      })

      expect(workspaceUpdated).toMatchObject(fieldsUpdated)
    })
  })

  describe('inviteToWorkspace', () => {
    test('should reject when provide invalid token', async () => {
      const response = await request(deps.app.getHttpServer())
        .post('/workspace/fake/invitation')
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
    })

    test('should reject when workspace does not belong to request user', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { user: extUser } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, extUser)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post(`/workspace/${workspace.id}/invitation`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      expect(response.body.code).toEqual('not_found_workspace')
    })

    test('should reject when request user is not workspace owner', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user, {
        role: 'MEMBER',
      })

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post(`/workspace/${workspace.id}/invitation`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.FORBIDDEN)
      expect(response.body.code).toEqual('invalid_member_role')
    })

    test('should reject when send invalid body', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post(`/workspace/${workspace.id}/invitation`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({
          email: 'fake',
        })

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.body.message.length).toBeGreaterThan(0)
    })

    test.only('should create invitation when everything is OK', async () => {
      const mailMock = jest.spyOn(Emailer.prototype, 'send').mockResolvedValue()

      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const body = {
        email: 'lucianoalvarez1212@gmail.com',
      }

      const response = await request(deps.app.getHttpServer())
        .post(`/workspace/${workspace.id}/invitation`)
        .set('Cookie', [`review-c_session=${token}`])
        .send(body)

      expect(mailMock).toBeCalled()

      expect(response.statusCode).toEqual(HttpStatus.CREATED)

      expect(response.body).toMatchObject({
        invitationId: expect.any(Number),
      })

      const invitation = await deps.dbService.invitation.findFirst({
        where: {
          id: response.body.invitationId,
        },
      })

      expect(invitation).toMatchObject({
        ...body,
        workspaceId: workspace.id,
        token: expect.any(String),
      })
    })
  })

  describe('removeInvitation', () => {
    test('should reject when provide invalid token', async () => {
      const response = await request(deps.app.getHttpServer())
        .delete('/workspace/fake/invitation/fake')
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
    })

    test('should reject when workspace does not belong to request user', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { user: extUser } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, extUser)

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .delete('/workspace/fake/invitation/fake')
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      expect(response.body.code).toEqual('not_found_workspace')
    })

    test('should reject when request user is not workspace owner', async () => {
      const { user } = await userSeeder(deps.dbService)

      const { workspace } = await workspaceSeeder(deps.dbService, user, {
        role: 'MEMBER',
      })

      const token = deps.app.get<JwtService>(USER_JWT_SERVICE).sign({
        sub: user.id,
      })

      const response = await request(deps.app.getHttpServer())
        .post(`/workspace/${workspace.id}/invitation`)
        .set('Cookie', [`review-c_session=${token}`])
        .send({})

      expect(response.statusCode).toEqual(HttpStatus.FORBIDDEN)
      expect(response.body.code).toEqual('invalid_member_role')
    })
  })
})
