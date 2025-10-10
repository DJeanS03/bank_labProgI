import { HelloResponseDTO } from './HelloResponseDTO';

export interface IHelloPresenter {
  present(response: HelloResponseDTO): any;
}
