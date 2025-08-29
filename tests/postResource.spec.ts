import { handler } from '../src/handlers/postResource';
import { Logger } from '../src/utils/Logger';

const mockSaveItem = jest.fn();

jest.mock('../src/services/DynamoService', () => ({
  DynamoService: jest.fn().mockImplementation(() => ({
    saveItem: mockSaveItem,
  })),
}));

jest.mock('../src/utils/Logger');

describe('handler postResource', () => {
  let mockEvent: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEvent = { body: JSON.stringify({ name: 'CustomItem' }) };
  });

  it('Debe almacenar un item y retornar éxito', async () => {
    mockSaveItem.mockResolvedValueOnce(true);

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ success: true });
    expect(mockSaveItem).toHaveBeenCalledWith({ name: 'CustomItem', type: 'custom' });
    expect(Logger.info).toHaveBeenCalled();
  });

  it('Debe manejar errores correctamente', async () => {
    const errorMessage = 'Dynamo save error';
    mockSaveItem.mockRejectedValueOnce(new Error(errorMessage));

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: errorMessage });
    expect(Logger.error).toHaveBeenCalled();
  });
});
