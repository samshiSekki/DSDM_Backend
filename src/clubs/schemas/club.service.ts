import { Injectable } from '@nestjs/common';

@Injectable()
export class ClubService {
  getHello(): string {
    return 'Hello World!';
  }
}
