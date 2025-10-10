import { HelloRequestDTO } from '../interface/HelloRequestDTO';
import { HelloResponseDTO } from '../interface/HelloResponseDTO';

export interface IHelloUseCase {
  execute(dto: HelloRequestDTO): Promise<HelloResponseDTO>;
}
