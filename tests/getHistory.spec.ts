import { handler } from '../src/handlers/getHistory';
import { Logger } from '../src/utils/Logger';

const mockGetHistory = jest.fn();

jest.mock('../src/services/DynamoService', () => ({
  DynamoService: jest.fn().mockImplementation(() => ({
    getHistory: mockGetHistory,
  })),
}));

jest.mock('../src/utils/Logger');

describe('handler getHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DYNAMO_HISTORY_LIMIT = '10';
  });

  it('Debe retornar el historial correctamente', async () => {
    const mockHistory = [{ id: 1, name: 'Luke' }];
    mockGetHistory.mockResolvedValueOnce(mockHistory);

    const response = await handler();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockHistory);
    expect(mockGetHistory).toHaveBeenCalledWith(10);
    expect(Logger.info).toHaveBeenCalled();
  });

  it('Debe manejar errores correctamente', async () => {
    const errorMessage = 'Dynamo error';
    mockGetHistory.mockRejectedValueOnce(new Error(errorMessage));

    const response = await handler();

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: errorMessage });
    expect(Logger.error).toHaveBeenCalled();
  });
});
