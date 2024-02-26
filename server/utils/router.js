import { Router } from "express";

import { findTrainers, findTrainer, upsertTrainer } from "~/server/utils/trainer";

import { findPokemon } from "~/server/utils/pokemon";

 

const router = Router();

 

router.get("/hello", (_req, res) => {

  res.send("Hello World");

});

 

/** トレーナー名の一覧の取得 */

router.get("/trainers", async (_req, res, next) => {

  try {

    const trainers = await findTrainers();

    // TODO: 期待するレスポンスボディに変更する

    res.send(trainers);

  } catch (err) {

    next(err);

  }

});

 

/** トレーナーの追加 */

router.post("/trainer", async (req, res, next) => {

  try {

    if (!("name" in req.body && req.body.name.length > 0))

      return res.sendStatus(400);

    const trainers = await findTrainers();

    if (trainers.some(({ Key }) => Key === `${req.body.name}.json`))

      return res.sendStatus(409);

    const result = await upsertTrainer(req.body.name, req.body);

    res.status(result["$metadata"].httpStatusCode).send(result);

  } catch (err) {

    next(err);

  }

});

 

/** トレーナーの取得 */

router.get("/trainer/:trainerName", async (req, res, next) => {

  try {

    const { trainerName } = req.params;

    const trainer = await findTrainer(trainerName);

    res.send(trainer);

  } catch (err) {

    next(err);

  }

});

 

/** トレーナーの更新 */

router.post("/trainer/:trainerName", async (req, res, next) => {

  try {

    const { trainerName } = req.params;

    // TODO: トレーナーが存在していなければ404を返す

    const result = await upsertTrainer(trainerName, req.body);

    res.status(result["$metadata"].httpStatusCode).send(result);

  } catch (err) {

    next(err);

  }

});

 

/** トレーナーの削除 */

// TODO: トレーナーを削除する API エンドポイントの実装

 

/** ポケモンの追加 */

router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {

  try {

    const { trainerName } = req.params;

    const trainer = await findTrainer(trainerName);

    if (!("name" in req.body && req.body.name.length > 0))

      return res.sendStatus(400);

    const pokemon = await findPokemon(req.body.name);

    const {

      order,

      name,

      sprites: { front_default },

    } = pokemon;

    trainer.pokemons.push({

      id: (trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1,

      nickname: "",

      order,

      name,

      sprites: { front_default },

    });

    const result = await upsertTrainer(trainerName, trainer);

    res.status(result["$metadata"].httpStatusCode).send(result);

  } catch (err) {

    next(err);

  }

});

 

/** ポケモンの削除 */

// TODO: ポケモンを削除する API エンドポイントの実装

 

export default router;