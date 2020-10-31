import { ViewEntity, ViewColumn } from 'typeorm';
import { AccountType, FullUser, ProStatus } from 'retro-board-common';

@ViewEntity({
  expression: `
select 
	u.id,
	u.name,
	u."accountType",
	u.username,
	u."stripeId",
	u.photo,
  u.language,
  u.email,
	coalesce(s.id, s2.id) as "subscriptionsId",
	coalesce(s.active, s2.active) as "pro"
from users u 
left join subscriptions s on s."ownerId" = u.id and s.active is true
left join "subscriptions-users" su on su."usersId" = u.id
left join subscriptions s2 on s2.id = su."subscriptionsId" and s2.active is true
  `,
})
export default class UserView {
  @ViewColumn()
  public id: string;
  @ViewColumn()
  public name: string;
  @ViewColumn()
  public accountType: AccountType;
  @ViewColumn()
  public username: string | null;
  @ViewColumn()
  public email: string | null;
  @ViewColumn()
  public stripeId: string | null;
  @ViewColumn()
  public photo: string | null;
  @ViewColumn()
  public language: string;
  @ViewColumn()
  public subscriptionsId: string | null;
  @ViewColumn()
  public pro: ProStatus | null;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.language = 'en';
    this.accountType = 'anonymous';
    this.username = null;
    this.photo = null;
    this.stripeId = null;
    this.subscriptionsId = null;
    this.pro = null;
    this.email = null;
  }

  toJson(): FullUser {
    return {
      id: this.id,
      name: this.name,
      photo: this.photo,
      pro: this.pro,
      subscriptionsId: this.subscriptionsId,
      accountType: this.accountType,
      language: this.language,
      username: this.username,
      stripeId: this.stripeId,
    };
  }
}
