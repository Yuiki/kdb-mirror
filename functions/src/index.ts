import * as parse from "csv-parse/lib/sync"
import * as fs from "fs"
import * as admin from "firebase-admin"

const serviceAccount = require("../serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kdb-mirror.firebaseio.com"
})

const main = async () => {
  const csv = fs.readFileSync("res/kdb_20190927.csv")
  const courses = parse(csv, {
    relax: true,
    relax_column_count: true
  })
  await Promise.all(
    courses.map(async (course: any[]) => {
      await sleep()
      console.log(course[0])
      return admin
        .firestore()
        .collection("courses")
        .doc(course[0])
        .set({
          name: course[1],
          method: Number(course[2]),
          credits: Number(course[3]),
          year: course[4],
          term: course[5],
          weekdayAndPeriod: course[6],
          classRoom: course[7],
          instructor: course[8],
          overview: course[9]
        })
    })
  )
}

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2)
  })
}

main()
