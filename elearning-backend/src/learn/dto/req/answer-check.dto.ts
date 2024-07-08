import { IsArray, IsUUID } from 'class-validator';

export class AnswerCheckDto {
  @IsUUID('4')
  questionId: string;

  @IsUUID('4', { each: true })
  @IsArray()
  answerIds: string[];
}
