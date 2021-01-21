import { Injectable } from "@nestjs/common";
import { Between, getRepository } from "typeorm";
//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../../entity/interaction_header_history_today.entity";

import { LibsService } from "../libs/services/lib.service";
import { ParamGeneral } from "./dto/dashboard.dto";
@Injectable()
export class DashboardService {
  constructor(private readonly libService: LibsService) {}

  async getData(payload: ParamGeneral) {
    try {
      let caseInResult = await this.caseIn(payload);
      if (caseInResult.isError) {
        return caseInResult;
      }

      let output = {
        caseIn: caseInResult.data,
      };
      return { isError: false, data: output, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async caseIn(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      let countHistory = 0;
      let countToday = 0;
      if (nowDate == payload.dateFrom) {
        //WALLBOARD
        const repoHistoryToday = getRepository(InteractionHeaderHistoryToday);
        const repoHeader = getRepository(InteractionHeader);

        countHistory = await repoHistoryToday.count({
          where: [
            {
              startDate: Between(
                new Date(`${nowDate} 00:00:00`),
                new Date(`${nowDate} 23:59:59`)
              ),
            },
          ],
        });
        countToday = await repoHeader.count({
          where: [
            {
              startDate: Between(
                new Date(`${nowDate} 00:00:00`),
                new Date(`${nowDate} 23:59:59`)
              ),
            },
          ],
        });
      } else {
        //DASHBOARD
        const repoHistoryToday = getRepository(InteractionHeaderHistory);
        const repoHeader = getRepository(InteractionHeader);

        countHistory = await repoHistoryToday.count({
          where: [
            {
              startDate: Between(
                new Date(`${payload.dateFrom} 00:00:00`),
                new Date(`${payload.dateTo} 23:59:59`)
              ),
            },
          ],
        });

        countToday = await repoHeader.count({
          where: [
            {
              startDate: Between(
                new Date(`${payload.dateFrom} 00:00:00`),
                new Date(`${payload.dateTo} 23:59:59`)
              ),
            },
          ],
        });
      }
      return {
        isError: false,
        data: countHistory + countToday,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
