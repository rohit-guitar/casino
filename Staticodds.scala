import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.Column
import java.sql.DriverManager
import java.sql.Connection
import org.apache.spark.sql.GroupedData
import scala.math
import org.apache.spark.sql.functions.udf
import com.mysql.jdbc.ConnectionProperties
import java.util.Properties

object SampleApp {
  def main(args: Array[String]) {
    
    if(args.length==0 || args.length>1) {
      println("Invalid arguments")
      System.exit(1)
    }
    
    val driver = "com.mysql.jdbc.Driver"
    val username = "root"
    val password = "casino"
    val url = "jdbc:mysql://173.194.232.115/casinodb?user=" + username + "&password=" + password
    
    val conf = new SparkConf().setAppName("Point Spread").setMaster("local[3]");
    val sc = new SparkContext(conf)
    val sqlContext = new org.apache.spark.sql.SQLContext(sc)
    var connection:Connection = null
    
    try {
      // make the connection
      Class.forName(driver)
      connection = DriverManager.getConnection(url, username, password)
 
  
      var games2013 = sqlContext.read.format("jdbc").options( 
      Map("url" -> url,"driver"->driver,"dbtable" -> "game2013v2")).load()
      
      var allgames = sqlContext.read.format("jdbc").options( 
      Map("url" -> url,"driver"->driver,"dbtable" -> "gameMerged2")).load().select("Game Code","Home Team Code","Visit Team Code")
      
      var allstats = sqlContext.read.format("jdbc").options( 
      Map("url" -> url,"driver"->driver,"dbtable" -> "statsMerged2")).load()
      
      var weekGames = games2013.filter(games2013("Date")<=>args(0))
      weekGames = weekGames.select("Home Team Code","Visit Team Code")//.withColumnRenamed("Home Team Code", "hteam").withColumnRenamed("Visit Team Code","vteam")
      
      //weekGames.printSchema()
      
      
      val A = weekGames.as("A")
      val B = allgames.as("B")
      val temp=A.join(B, Seq("Home Team Code","Visit Team Code"))
      
      var reverseAllGames = allgames.withColumnRenamed("Home Team Code", "vteam").withColumnRenamed("Visit Team Code", "hteam")
      var reverseCurrGames = weekGames.withColumnRenamed("Home Team Code", "hteam").withColumnRenamed("Visit Team Code", "vteam")
      var temp1=reverseCurrGames.join(reverseAllGames, Seq("hteam","vteam")).select("hteam","vteam","Game Code") 
      var union = temp.unionAll(temp1)
      var union1 = union.select("Game Code","Home Team Code")
      var union2 =  union. select("Game Code","Visit Team Code")
      var comp = union1.unionAll(union2).withColumnRenamed("Home Team Code", "Team Code")
      
      val length = comp.count()
      
      if(length!=0)
      {
        var stats = allstats.select("Game Code", "Team Code","Points") 
        var points = comp.join(stats, Seq("Game Code","Team Code"))
        var x = points.as("x").withColumnRenamed("Team Code", "Team1").withColumnRenamed("Points", "Points1")
        var y = points.as("y").withColumnRenamed("Team Code", "Team2").withColumnRenamed("Points", "Points2")
        points = x.join(y, "Game Code").where("Team1!=Team2").dropDuplicates(Seq("Game Code"))
        points = points.withColumn("TotalBet", points("Points1")+points("Points2"))
        points = points.withColumn("pointSpread", points("Points1")-points("Points2"))
  
        var totalBet = points.groupBy("Team1","Team2").avg("TotalBet").withColumnRenamed("avg(TotalBet)", "totalbet")
        
        val myFunc = udf {(x: Int) => {if(x<0)x*(-1) else x}}
        
       val colNames = points.columns
       val cols = colNames.map(cName => points.col(cName))
       val theColumn = points("pointSpread")
       val mappedCols = cols.map(c => if (c.toString() == theColumn.toString()) myFunc(c).as("absPointSpread") else c)
       val newDF = points.select(mappedCols:_*)
       
       var pointSpread = newDF.groupBy("Team1","Team2").avg("absPointSpread")
      
       //pointSpread.collect().foreach(println)
        val p:Properties = new Properties();
       //p.setProperty("user", "root")
       //p.setProperty("password", "casino")
       
       totalBet.write.mode("append").jdbc(url, "totalbet",p)
       
       println("Program is finished uploading to DB")
      }
      
      else {
        
        println("There is no data")
        
      }
    //totalBet.printSchema()
     
   
    } catch {
      case e => e.printStackTrace+"roit"
    }
    
    sqlContext.wait()
    connection.close()
    sc.stop()
 
  }
}
