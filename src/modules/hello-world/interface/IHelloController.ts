import { HelloResponseDTO } from './HelloResponseDTO';
import { HelloRequestDTO } from './HelloRequestDTO';

export interface IHelloController {
  handle(request: HelloRequestDTO): Promise<HelloResponseDTO>;
}
