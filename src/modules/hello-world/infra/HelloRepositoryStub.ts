export class HelloRepositoryStub {
  async save(data: any): Promise<void> {
    console.log('Stub: salvando dados (não faz nada de verdade).');
    return await Promise.resolve();
  }

  async find(): Promise<any> {
    return await Promise.resolve({
      message: 'Stub: dados simulados do repositório.',
    });
  }
}
