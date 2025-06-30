import play.sbt.PlayImport._
import sbt._

object AppDependencies {
  lazy val bootStrapPlayVersion = "9.13.0"
  lazy val flexmarkAllVersion   = "0.64.8"

  lazy val compile: Seq[ModuleID] = Seq(
    ws,
    "uk.gov.hmrc" %% "bootstrap-frontend-play-30" % bootStrapPlayVersion
  )

  lazy val test: Seq[ModuleID] = Seq(
    "uk.gov.hmrc"         %% "bootstrap-test-play-30" % bootStrapPlayVersion,
    "com.vladsch.flexmark" % "flexmark-all"           % flexmarkAllVersion
  ).map(_ % Test)
}
