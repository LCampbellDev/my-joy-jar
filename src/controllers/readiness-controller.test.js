import { jest } from '@jest/globals';
import { createMockResponse } from '../../tests/test-helpers';

const databaseHealthRepo = {
  checkConnection: jest.fn(),
};
// repo mock required for ESM
jest.unstable_mockModule('../repositories/database-health.repo', () => ({
  databaseHealthRepo,
}));

const { readinessController } = await import('./readiness-controller');

describe('readinessController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns status 200 when the database is available', async () => {
    // Arrange
    databaseHealthRepo.checkConnection.mockResolvedValue(undefined);

    const req = {};
    const res = createMockResponse();

    // Act
    await readinessController(req, res);

    // Assert
    expect(databaseHealthRepo.checkConnection).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'ready',
    });
  });

  it('returns status 503 when the database check fails', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');
    databaseHealthRepo.checkConnection.mockRejectedValue(databaseError);

    const req = {};
    const res = createMockResponse();

    // Act
    await readinessController(req, res);

    // Assert
    expect(databaseHealthRepo.checkConnection).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: 'not ready',
    });
  });
});
