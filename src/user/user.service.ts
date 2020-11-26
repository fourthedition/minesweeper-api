import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Response } from 'express';
import {CreateUserDto} from '../dto/createUser'
@Injectable()
export class UserService {
  constructor(@Inject('User_REPOSITORY') private UserRepository: typeof User) {}

  async allUsers(): Promise<User[]> {  
    const user = this.UserRepository.findAll<User>();
    return user;
  }
  async findOrCreateFaceBook(profile: any, res: Response): Promise<any> {
    const user = await this.UserRepository.findOne<User>({ where:{'facebookid': profile.facebookId }});
    if (user) {
      return res.status(200).json(user.toJSON());;
    }
    const createdUser = await this.UserRepository.create<User>({
      name: profile.name,
      facebookId: profile.facebookId,
      avatar: profile.avatar,
    });
    return res.status(200).json(createdUser.toJSON());
  }

  async linkFaceBook(profile: any, res: Response): Promise<any> {
    const user = await this.UserRepository.findOne<User>({ where:{'facebookid': profile.facebookId }});
    if (user) {
      return res.status(200).json(user.toJSON());;
    }
    const userGuest = await this.UserRepository.findOne<User>({ where:{'id': profile.id }});
    if (userGuest){
    await this.UserRepository.update<User>(profile, {
      where: {
        id: profile.id,
      },
    });
    return res.status(200).json(profile);
  }
    const createdUser = await this.UserRepository.create<User>(profile);
    return res.status(200).json(createdUser.toJSON());
  }
  async CreateOrUpdate(profile: CreateUserDto, res: Response): Promise<any> {
    const user = await this.UserRepository.findOne<User>({ where:{'id': profile.id }});
    if (user) {
      await this.UserRepository.update<User>(profile, {
        where: {
          id: profile.id,
        },
      });
      return res.status(200).send('อัพเดพสำเร็จ');;
    }
    const createdUser = await this.UserRepository.create<User>(profile);
    return res.status(200).json(createdUser.toJSON());
  }

 

  async leaderBoard(): Promise<any> {
    const leaderboard = await this.UserRepository.findAll<User>({
      order: [['elorank', 'DESC']]
    })
    return leaderboard.slice(0,10)
  }

  async getUserById(id: any): Promise<any> {
    const user = await this.UserRepository.findByPk(id)
    return user
  }

  async eloRanking(player1Id: any, player2Id:any, score1: any, score2: any): Promise<any> {
    const player1 = await this.UserRepository.findByPk(player1Id)
    const player2 = await this.UserRepository.findByPk(player2Id)
    const avg = (player1.elorank + player2.elorank) / 2
    const k = (avg < 400)?40:(avg < 800)?35:(avg < 1200)?30:(avg < 1600)?25:(avg < 2000)?20:(avg < 2400)?15:10
    // const k1 = (player1.elorank < 800)?40:(player1.elorank < 1600)?30:(player1.elorank < 2400)?20:10
    // const k2 = (player2.elorank < 800)?40:(player2.elorank < 1600)?30:(player2.elorank < 2400)?20:10
    const expectedScore1 = 1/(1+10**((player2.elorank - player1.elorank)/400))
    const expectedScore2 = 1/(1+10**((player1.elorank - player2.elorank)/400))

    // player1
    const point1 = k * (score1 - expectedScore1)
    let win1 = player1.win
    let lose1 = player1.lose
    console.log(typeof(Number(score1)))
    if (score1 == '1') {
      win1 = win1 + 1
    }
    else{
      lose1 = lose1 + 1
    }
    console.log("Player 1 : " + point1)
    const newPlayer1:any = (player1.elorank+point1)
    player1.update({elorank: Math.max(0, newPlayer1.toFixed(0)), win: win1, lose: lose1})
    // player2
    const point2 = k * (score2 - expectedScore2)
    let win2 = player2.win
    let lose2 = player2.lose
    console.log(score2, Number(score2),typeof(Number(score2)))
    if (score2 == '1'){
      win2 = win2 + 1
    }
    else{
      lose2 = lose2 + 1
    }
    console.log("Player 2 : " + point2)
    const newPlayer2:any = (player2.elorank+point2)
    player2.update({elorank: Math.max(0 , newPlayer2.toFixed(0)), win: win2, lose: lose2})
    return [player1, player2]
  }
  
}
