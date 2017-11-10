// Fill out your copyright notice in the Description page of Project Settings.

#include "HttpActor.h"
#include "Json.h"

// Sets default values
AHttpActor::AHttpActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = false;

	Http = &FHttpModule::Get();
}

// Called when the game starts or when spawned
void AHttpActor::BeginPlay()
{
	Super::BeginPlay();

	FNewMatchData NewMatch;
	NewMatch.Name = "Create Match Test 1";
	NewMatch.GameToken = GameToken;
	NewMatch.HostIP = "127.0.0.1";
	NewMatch.HostPort = 25565;
	NewMatch.MaxPlayerCount = 10;
	HttpCreateMatch(NewMatch);
}

// Called every frame
void AHttpActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

// Get All Matches http call
void AHttpActor::HttpGetAllMatches()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Non Full Matches http call
void AHttpActor::HttpGetAllNonFullMatches()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/not_full/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Matches In Session http call
void AHttpActor::HttpGetAllMatchesInSession()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/in_session/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Matches Not In Session http call
void AHttpActor::HttpGetAllMatchesNotInSession()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/not_in_session/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

void AHttpActor::HttpCreateMatch(FNewMatchData MatchData)
{
	FString MatchDataAsJsonString = FString::Printf(TEXT("{ \"name\": \"%s\", \"gameToken\": \"%s\", \"hostIP\": \"%s\", \"hostPort\": %i, \"maxPlayerCount\": %i }"),
										 *MatchData.Name,
										 *MatchData.GameToken,
										 *MatchData.HostIP,
										 MatchData.HostPort,
										 MatchData.MaxPlayerCount);
	
	GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, MatchDataAsJsonString);
	UE_LOG(LogTemp, Warning, TEXT("Http POST request body json object: %s"), *MatchDataAsJsonString);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpCreateMatchResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/"));
	Request->SetVerb("POST");
	Request->SetContentAsString(MatchDataAsJsonString);
	//Request->ProcessRequest();
}

// Get Matches http call response
void AHttpActor::OnHttpGetResponseReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		//Create a pointer to hold the json serialized data
		TSharedPtr<FJsonObject> JsonObject;
		TSharedPtr<FJsonValue> JsonValue;

		//Create a reader pointer to read the json data
		TSharedRef<TJsonReader<TCHAR>> Reader = TJsonReaderFactory<TCHAR>::Create(*Response->GetContentAsString());

		//Deserialize the json data given Reader and the actual object to deserialize
		if (FJsonSerializer::Deserialize(Reader, JsonValue))
		{
			TArray<TSharedPtr<FJsonValue>> ObjArray = JsonValue->AsArray();
			for (int i = 0; i < ObjArray.Num(); i++)
			{
				FGameData NewGameData;
				NewGameData.Id = ObjArray[i]->AsObject()->GetStringField("_id");
				NewGameData.GameToken = ObjArray[i]->AsObject()->GetStringField("gameToken");
				NewGameData.Name = ObjArray[i]->AsObject()->GetStringField("name");
				NewGameData.HostIP = ObjArray[i]->AsObject()->GetStringField("hostIP");
				NewGameData.HostPort = ObjArray[i]->AsObject()->GetIntegerField("hostPort");
				NewGameData.VersionNumber = ObjArray[i]->AsObject()->GetIntegerField("__v");
				NewGameData.LastModified = ObjArray[i]->AsObject()->GetStringField("lastModified");
				NewGameData.MiscInfo = ObjArray[i]->AsObject()->GetStringField("miscInfo");
				NewGameData.MaxPlayerCount = ObjArray[i]->AsObject()->GetIntegerField("maxPlayerCount");
				NewGameData.PlayerCount = ObjArray[i]->AsObject()->GetIntegerField("playerCount");
				NewGameData.Status = ObjArray[i]->AsObject()->GetIntegerField("status");

				GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, TEXT("Match Name: " + NewGameData.Name));
			}
		}
		else
		{
			GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, "Json Deserializer failed");
			GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, TEXT("Response Code: " + FString::FromInt(Response->GetResponseCode())));
			UE_LOG(LogTemp, Warning, TEXT("Http Get request failed, json object: %s"), *Response->GetContentAsString());
		}
	}
	else
	{
		GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Purple, "Get request not successful");
	}
}

void AHttpActor::OnHttpCreateMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		//Create a pointer to hold the json serialized data
		TSharedPtr<FJsonObject> JsonObject;
		TSharedPtr<FJsonValue> JsonValue;

		//Create a reader pointer to read the json data
		TSharedRef<TJsonReader<TCHAR>> Reader = TJsonReaderFactory<TCHAR>::Create(*Response->GetContentAsString());

		//Deserialize the json data given Reader and the actual object to deserialize
		if (FJsonSerializer::Deserialize(Reader, JsonValue))
		{
			TArray<TSharedPtr<FJsonValue>> ObjArray = JsonValue->AsArray();
			for (int i = 0; i < ObjArray.Num(); i++)
			{
				FGameData NewGameData;
				NewGameData.Id = ObjArray[i]->AsObject()->GetStringField("_id");
				NewGameData.GameToken = ObjArray[i]->AsObject()->GetStringField("gameToken");
				NewGameData.Name = ObjArray[i]->AsObject()->GetStringField("name");
				NewGameData.HostIP = ObjArray[i]->AsObject()->GetStringField("hostIP");
				NewGameData.HostPort = ObjArray[i]->AsObject()->GetIntegerField("hostPort");
				NewGameData.VersionNumber = ObjArray[i]->AsObject()->GetIntegerField("__v");
				//NewGameData.LastModified = ObjArray[i]->AsObject()->GetStringField("lastModified");
				//NewGameData.MiscInfo = ObjArray[i]->AsObject()->GetStringField("miscInfo");
				//NewGameData.MaxPlayerCount = ObjArray[i]->AsObject()->GetIntegerField("maxPlayerCount");
				NewGameData.PlayerCount = ObjArray[i]->AsObject()->GetIntegerField("playerCount");
				NewGameData.Status = ObjArray[i]->AsObject()->GetIntegerField("status");

				GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, TEXT("Match Created: " + NewGameData.Name));
			}
		}
		else
		{
			GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, "Json Deserializer failed");
			GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Red, TEXT("Response Code: " + FString::FromInt(Response->GetResponseCode())));
			UE_LOG(LogTemp, Warning, TEXT("Http POST request failed, json object: %s"), *Response->GetContentAsString());
		}
	}
	else
	{
		GEngine->AddOnScreenDebugMessage(-1, 15.0f, FColor::Purple, "Get request not successful");
	}
}

