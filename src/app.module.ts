import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClubController } from './clubs/schemas/club.controller';
import { ClubService } from './clubs/schemas/club.service';
import { ExcelService } from './excel/excel.service';
import { Club, ClubSchema } from './clubs/schemas/club.entity';
import { ClubRepository } from './clubs/schemas/club.repository';
import { Suggestion, SuggestionSchema } from './clubs/schemas/suggestion.entitiy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.DB_url}`,
      }),
    }),
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
    MongooseModule.forFeature([{ name: Suggestion.name, schema: SuggestionSchema}]),
  ],
  controllers: [AppController, ClubController],
  providers: [AppService, ClubService, ClubRepository, ExcelService],
})
export class AppModule {}
