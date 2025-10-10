import { HelloRequestDTO } from '../interface/HelloRequestDTO';
import { HelloResponseDTO } from '../interface/HelloResponseDTO';

export class HelloControllerAdapterStub {
  async handle(request: HelloRequestDTO): Promise<HelloResponseDTO> {
    return await Promise.resolve({
      message: 'Stub: Olá, ' + request.name + '!',
    });
  }
}
